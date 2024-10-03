import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { BetService } from 'src/bets/services/bet.service';
import { FirebaseProviderService } from 'src/firebase/services/firebase.provider.service';
import { GlobalLogger } from 'src/logger/global.logger.service';

@Injectable()
export class FirestoreBetsListenerService
  implements OnModuleInit, OnModuleDestroy
{
  private unsubscribeSettlementListener: () => void;

  constructor(
    private readonly firebaseProvider: FirebaseProviderService,
    private readonly betsService: BetService,
    private readonly logger: GlobalLogger,
  ) {}

  onModuleInit() {
    this.startListening();
  }

  onModuleDestroy() {
    if (this.unsubscribeSettlementListener) {
      this.unsubscribeSettlementListener();
    }
  }

  private startListening() {
    const firestore = this.firebaseProvider.getFirestore();
    const settlementsCollection = firestore.collection('settlements');

    // Listen for changes in the settlements collection
    this.unsubscribeSettlementListener = settlementsCollection.onSnapshot(
      (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          const data = change.doc.data();
          const roundId = change.doc.id;

          if (change.type === 'added' || change.type === 'modified') {
            this.handleDocumentChange(roundId, data);
          }
        });
      },
      (error) => {
        this.logger.error(
          'Error listening to Firestore settlements:',
          error.stack,
        );
      },
    );
  }

  private async handleDocumentChange(roundId: string, data: any) {
    try {
      // Check conditions to trigger settlement
      if (!data.settlementProcessed && data.finished && !data.trigerRollBack) {
        this.logger.debug(`Triggering settlement on roundId: ${roundId}`);
        await this.betsService.processSettlement(roundId, data);
      }

      // Check conditions to trigger rollback
      if (data.trigerRollBack && !data.rollbacked) {
        this.logger.debug(`Triggering rollback on roundId: ${roundId}`);
        await this.betsService.processRollback(roundId);
      }
    } catch (error) {
      this.logger.error(
        `Error processing settlement/rollback for roundId ${roundId}:`,
        error,
      );
    }
  }
}

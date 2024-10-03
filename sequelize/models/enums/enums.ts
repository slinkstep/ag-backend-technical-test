export enum UserStatus {
    ACTIVE = 'active',
    BLOCKED = 'blocked',
  }
  
  export enum BetStatus {
    OPEN = 'open',
    SETTLED = 'settled',
    ROLLBACKED = 'rollBacked',
  }
  
  export enum TransactionCategory {
    PROFIT = 'profit',
    BET = 'bet',
    REFUND = 'refund',
    CAMPAIGN = 'campaign',
    POSITIVE_ADJUSTMENT = 'postitive_adjustment',
    NEGATIVE_ADJUSTMENT = 'negative_adjustment'
  }
  
  export enum TransactionStatus {
    APPROVED = 'approved',
    CANCELED = 'canceled',
  }
  
  export enum BalanceType {
    REAL_BALANCE = 'real_balance',
    BONUS_BALANCE = 'bonus_balance',
  }
  
  export enum CampaignCategory {
    REGISTER = 'register',
    PROMOTIONAL = 'promotional',
  }
  
  export enum CampaignStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
  }
  
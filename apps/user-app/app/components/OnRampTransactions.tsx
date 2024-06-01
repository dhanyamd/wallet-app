import { Card } from "@repo/ui/card"

const getStatement = (status: string) => {
    if (status === 'Success') {
      return 'Received INR'
    } else if (status === 'Processing') {
      return 'To be Received INR'
    } else {
      return 'Failed'
    }
  }

export const OnRampTransactions = ({
  transactions,
  title = 'Recent wallet Transactions',
}: {
    transactions: {
    time: Date
    amount: number
    status: string
    provider: string
  }[]
  title?: string
}) => {
    if (!transactions.length) {
        return <Card title={"Transactions"}  >
            <div className="text-center pb-8 pt-8">
                No Recent transactions
            </div>
        </Card>
    }
    return <Card title="Recent Transactions">
        <div className="pt-2">
            {transactions.map(t => <div className="flex justify-between">
                <div>
                    <div className="text-sm">
                        Received INR
                    </div>
                    <div className="text-slate-600 text-xs">
                        {t.time.toDateString()}
                        {getStatement(t.status)}
                    </div>
                </div>
                <div className="flex flex-col justify-center">
                    + Rs {t.amount / 100}
                </div>

            </div>)}
        </div>
    </Card>
}
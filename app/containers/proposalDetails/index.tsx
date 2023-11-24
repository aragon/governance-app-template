import * as dayjs from 'dayjs'

interface ProposalDetailsProps {
  supportThreshold: number;
  endDate: bigint;
  snapshotBlock: bigint;
}

const ProposalDetails: React.FC<ProposalDetailsProps> = ({ supportThreshold, endDate, snapshotBlock }) => {

  return (
    <>
      <div className="flex space-between border border-neutral-300 rounded-2xl py-5 px-3">
        <h2 className="text-xl flex-grow font-semibold text-neutral-600 pr-6">Thresshold</h2>
        <div className="items-right text-right flex-wrap">
          <span className="text-xl font-semibold">{supportThreshold}</span>
          <p className="text-neutral-600">voting power</p>
        </div>
      </div>
      <div className="flex space-between border border-neutral-300 rounded-2xl py-5 px-3">
        <h2 className="text-xl flex-grow font-semibold pr-6 text-neutral-600">Ends</h2>
        <div className="items-right text-right flex-wrap">
          <span className="text-xl mr-2 font-semibold">{dayjs(Number(endDate) * 1000).format('DD/MM/YYYY')}</span>
          <p className="text-neutral-600">unix time</p>
        </div>
      </div>
      <div className="flex space-between border border-neutral-300 rounded-2xl py-5 px-3">
        <h2 className="text-xl flex-grow font-semibold text-neutral-600 pr-6">Snapshot</h2>
        <div className="items-right text-right flex-wrap">
          <p className="text-neutral-600">Taken at block</p>
          <span className="text-xl mr-2 font-semibold">{snapshotBlock.toLocaleString()}</span>
        </div>
      </div>
    </>
  )
}

export default ProposalDetails;

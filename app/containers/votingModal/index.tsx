import { Button } from '@aragon/ods'

interface VotingModalProps {
  show: boolean;
  setShow: (show: boolean) => void;
  voteFor: (option: number) => void;
}

const VotingModal: React.FC<VotingModalProps> = ({ show, setShow, voteFor }) => {
  if (!show) return null;

  return (
    <>
      <div
        className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="relative w-auto my-6 mx-auto max-w-sm">
          {/*content*/}
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-neutral-50 outline-none focus:outline-none">
            {/*header*/}
            <div className="flex items-start justify-between p-5 border-b border-solid border-primary-200 rounded-t">
              <h3 className="text-3xl font-semibold text-neutral-700">
                Choose wisely
              </h3>
              <button
                className="p-1 ml-auto bg-transparent border-0 text-neutral-800 opacity-1 float-right text-3xl "
                onClick={() => setShow(false)}
              >
                <span className="bg-transparent text-neutral-800 opacity-1 h-6 w-6 text-2xl block font-semibold">
                  ×
                </span>
              </button>
            </div>
            {/*footer*/}
            <div className="flex items-center justify-end p-6 border-t border-solid border-neutral-200 rounded-b">
              <Button
                className="flex h-5 items-center m-2"
                size="md"
                variant="success"
                onClick={() => voteFor(2)}
              >For</Button>
              <Button
                className="flex h-5 items-center m-2"
                size="md"
                variant="critical"
                onClick={() => voteFor(3)}
              >Against</Button>

              <Button
                className="flex h-5 items-center m-2"
                size="md"
                variant="tertiary"
                onClick={() => voteFor(1)}
              >Abstain</Button>

            </div>
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-neutral-900"></div>
    </>
  )
}

export default VotingModal;

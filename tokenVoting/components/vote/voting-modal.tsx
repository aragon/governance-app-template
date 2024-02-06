import { Button } from "@aragon/ods";

const ABSTAIN_VALUE = 1;
const VOTE_YES_VALUE = 2;
const VOTE_NO_VALUE = 3;

interface VotingModalProps {
  show: boolean;
  setShow: (show: boolean) => void;
  voteFor: (option: number) => void;
}

const VotingModal: React.FC<VotingModalProps> = ({
  show,
  setShow,
  voteFor,
}) => {
  if (!show) return null;

  return (
    <>
      <div
        className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
        onClick={() => setShow(false)}
      >
        <div onClick={e => e.stopPropagation()} className="relative w-auto my-6 mx-auto max-w-sm min-w-72">
          {/*content*/}
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-neutral-50 outline-none focus:outline-none">
            {/*header*/}
            <div className="flex items-start justify-between p-5 pb-3 border-b border-solid border-primary-200 rounded-t">
              <h3 className="text-xl pr-4 font-semibold text-neutral-700">
                Vote submission
              </h3>
              <button
                className="p-1 bg-transparent hover:bg-neutral-100 active:bg-neutral-200 border-0 text-neutral-800 opacity-1 float-right text-3xl rounded-lg"
                onClick={() => setShow(false)}
              >
                <span className="-mt-1 bg-transparent text-neutral-800 opacity-1 h-8 w-6 text-2xl block font-semibold">
                  ×
                </span>
              </button>
            </div>
            {/*footer*/}
            <div className="p-3 w-full border-t border-solid border-neutral-100 rounded-b">
              <p>Select your vote option</p>
              <Button
                className="w-full h-5 my-3 items-center"
                size="md"
                variant="tertiary"
                onClick={() => voteFor(VOTE_YES_VALUE)}
              >
                <span className="text-success-700">Vote yes</span>
              </Button>
              <Button
                className="w-full h-5 my-3 items-center"
                size="md"
                variant="tertiary"
                onClick={() => voteFor(VOTE_NO_VALUE)}
              >
                <span className="text-critical-700">Vote no</span>
              </Button>

              <Button
                className="w-full h-5 my-3 items-center"
                size="md"
                variant="tertiary"
                onClick={() => voteFor(ABSTAIN_VALUE)}
              >
                Abstain
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-neutral-900"></div>
    </>
  );
};

export default VotingModal;

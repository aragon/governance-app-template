import { Button } from "@aragon/ods";

const ABSTAIN_VALUE = 1;
const VOTE_YES_VALUE = 2;
const VOTE_NO_VALUE = 3;

interface VotingModalProps {
  onDismissModal: () => void;
  selectedVote: (option: number) => void;
}

const VotingModal: React.FC<VotingModalProps> = ({ onDismissModal, selectedVote }) => {
  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden outline-none focus:outline-none"
        onClick={() => onDismissModal()}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="relative mx-2 my-6 w-auto min-w-64 max-w-sm drop-shadow-xl"
        >
          {/*content*/}
          <div className="relative flex w-full flex-col rounded-lg bg-neutral-100 outline-none focus:outline-none">
            {/*header*/}
            <div className="flex items-start justify-between rounded-t p-3">
              <h3 className="pr-4 text-lg font-semibold text-neutral-700">Vote submission</h3>
              <button
                className="opacity-1 float-right rounded-lg bg-transparent text-3xl text-neutral-800 hover:bg-neutral-200 active:bg-neutral-200"
                onClick={() => onDismissModal()}
              >
                <span className="opacity-1 -mt-1 block h-8 w-6 bg-transparent text-2xl text-neutral-800">×</span>
              </button>
            </div>
            {/*footer*/}
            <div className="w-full rounded-b-lg bg-neutral-50 p-3">
              <p className="text-sm">
                You are about to vote for the current proposal. This will create a transaction that you will need to
                sign.
              </p>
              <p className="mt-3 text-sm">Select your vote option:</p>
              <Button
                className="my-3 h-5 w-full items-center"
                size="md"
                variant="tertiary"
                onClick={() => selectedVote(VOTE_YES_VALUE)}
              >
                <span className="text-success-700">Vote yes</span>
              </Button>
              <Button
                className="my-3 h-5 w-full items-center"
                size="md"
                variant="tertiary"
                onClick={() => selectedVote(VOTE_NO_VALUE)}
              >
                <span className="text-critical-700">Vote no</span>
              </Button>

              <Button
                className="my-3 h-5 w-full items-center"
                size="md"
                variant="tertiary"
                onClick={() => selectedVote(ABSTAIN_VALUE)}
              >
                Abstain
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="fixed inset-0 z-40 bg-neutral-900 opacity-25"></div>
    </>
  );
};

export default VotingModal;

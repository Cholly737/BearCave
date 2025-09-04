import WebView from "@/components/WebView";

const Registrations = () => {
  return (
    <div>
      <h2 className="text-xl font-heading font-bold px-4 py-3">Team Registrations</h2>
      
      <div className="px-4 pb-20">
        <div className="h-[calc(100vh-120px)]">
          <WebView
            url="https://www.playhq.com/cricket-australia/org/deepdene-bears-cricket-club/7e3945ee/register"
            title="Deepdene Bears Registration"
            onClose={() => {}}
          />
        </div>
      </div>
    </div>
  );
};

export default Registrations;
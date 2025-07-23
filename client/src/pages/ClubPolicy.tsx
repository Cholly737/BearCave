import { Card, CardContent } from "@/components/ui/card";

const ClubPolicy = () => {
  return (
    <div>
      <h2 className="text-xl font-heading font-bold px-4 py-3">Club Policy</h2>
      
      <div className="px-4 pb-20">
        <Card className="mb-4">
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-3 text-primary">Code of Conduct</h3>
            <div className="space-y-3 text-sm">
              <p>All members of the Deepdene Bears Cricket Club are expected to maintain the highest standards of behavior both on and off the field.</p>
              <ul className="list-disc list-inside space-y-2 text-neutral-700">
                <li>Respect all players, officials, and spectators</li>
                <li>Play within the spirit of the game</li>
                <li>Accept decisions of umpires without dissent</li>
                <li>Support teammates and encourage fair play</li>
                <li>Maintain club facilities and equipment</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-4">
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-3 text-primary">Player Responsibilities</h3>
            <div className="space-y-3 text-sm">
              <ul className="list-disc list-inside space-y-2 text-neutral-700">
                <li>Arrive on time for training and matches</li>
                <li>Notify team management of availability changes</li>
                <li>Wear appropriate club uniform and protective equipment</li>
                <li>Pay membership fees and match contributions promptly</li>
                <li>Participate actively in club activities and fundraising</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-4">
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-3 text-primary">Health & Safety</h3>
            <div className="space-y-3 text-sm">
              <p>The club is committed to providing a safe environment for all participants.</p>
              <ul className="list-disc list-inside space-y-2 text-neutral-700">
                <li>All protective equipment must be worn during training and matches</li>
                <li>Report any injuries immediately to team management</li>
                <li>Follow ground safety rules and emergency procedures</li>
                <li>No alcohol consumption during training or matches</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-4">
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-3 text-primary">Disciplinary Procedures</h3>
            <div className="space-y-3 text-sm">
              <p>Any breaches of club policy will be addressed through our disciplinary process:</p>
              <ol className="list-decimal list-inside space-y-2 text-neutral-700">
                <li>Verbal warning from team captain or coach</li>
                <li>Written warning from club committee</li>
                <li>Suspension from team activities</li>
                <li>Termination of club membership</li>
              </ol>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-3 text-primary">Contact</h3>
            <div className="space-y-2 text-sm">
              <p>For questions about club policies, contact:</p>
              <div className="flex items-center">
                <i className="ri-mail-line text-lg text-primary mr-3"></i>
                <a href="mailto:deepdenebears@gmail.com" className="text-primary hover:underline">
                  deepdenebears@gmail.com
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ClubPolicy;
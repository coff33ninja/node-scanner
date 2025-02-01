import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Terms = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Button
        variant="ghost"
        className="mb-4"
        onClick={() => navigate(-1)}
      >
        ← Back
      </Button>

      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>

      <div className="prose dark:prose-invert">
        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">1. Free Usage</h2>
          <p className="mb-4">
            This program is provided free of use. Users can freely:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Use all features of the application</li>
            <li>Scan their local network for devices</li>
            <li>Manage and wake devices on their network</li>
            <li>Store and track device information</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">2. Limitations</h2>
          <p className="mb-4">
            While the program is free to use, users must:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Not use the program for malicious purposes</li>
            <li>Not attempt to bypass security measures</li>
            <li>Not redistribute the program without proper attribution</li>
            <li>Use the program in accordance with local network policies</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">3. Privacy & Data</h2>
          <p>
            Please refer to our <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a> for 
            information about how we handle your data.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">4. Disclaimer</h2>
          <p>
            This program is provided "as is" without warranty of any kind. The creators are not 
            liable for any damages arising from its use.
          </p>
        </section>
      </div>
    </div>
  );
};

export default Terms;
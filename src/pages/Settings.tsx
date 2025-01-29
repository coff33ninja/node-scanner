import Layout from "@/components/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GeneralForm } from "@/components/settings/general/GeneralForm";
import { TwoFactorSection } from "@/components/settings/security/TwoFactorSection";
import { DataSection } from "@/components/settings/privacy/DataSection";
import { NetworkForm } from "@/components/settings/network/NetworkForm";
import { useState } from "react";

const Settings = () => {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [trackingEnabled, setTrackingEnabled] = useState(true);
  const [marketingEnabled, setMarketingEnabled] = useState(false);

  return (
    <Layout>
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6">Settings</h1>
        <Tabs defaultValue="general" className="space-y-6">
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
            <TabsTrigger value="network">Network</TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <GeneralForm />
          </TabsContent>

          <TabsContent value="security">
            <TwoFactorSection 
              enabled={twoFactorEnabled}
              onToggle={setTwoFactorEnabled}
            />
          </TabsContent>

          <TabsContent value="privacy">
            <DataSection
              trackingEnabled={trackingEnabled}
              marketingEnabled={marketingEnabled}
              onTrackingToggle={setTrackingEnabled}
              onMarketingToggle={setMarketingEnabled}
            />
          </TabsContent>

          <TabsContent value="network">
            <NetworkForm />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Settings;
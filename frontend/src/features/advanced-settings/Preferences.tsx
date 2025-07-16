import { useState } from "react";
import Button from "../../components/Button";
import InfoTooltip from "../../components/InfoTooltip";
import { auth } from "../../config/firebase-config";
import { useAuth } from "../../hooks/useAuth";
import { useHotToast } from "../../hooks/useHotToast";
import { ViewDisplayOptions } from "../../types/types";
import { Heading } from "./Heading";
import PackingListTemplateEditor from "./PackingListTemplateEditor";
import { LocationViewSelector } from "./LocationViewSelector";
import { useUpdateUserSettings } from "../../hooks/useUpdateUserSettings";

export const Preferences = () => {
  const { settings, setSettings } = useAuth();
  const { updateSettings } = useUpdateUserSettings();
  const { notify } = useHotToast();

  const currentView = settings?.preferredDisplay || "gallery";

  const [isPackingListEditorOpen, setIsPackingListEditorOpen] = useState(false);
  const currentPackingList = settings?.packingList;

  const updateDefaultView = async (view: ViewDisplayOptions) => {
    if (auth.currentUser) {
      try {
        await updateSettings({
          ...settings!,
          preferredDisplay: view,
        });
        setSettings({ ...settings!, preferredDisplay: view });
      } catch {
        notify("Something went wrong. Please try again.", "error");
      }
    }
  };

  return (
    <>
      <div className="space-y-2">
        <Heading title="Preferences" />
        <div className="space-y-3">
          <div>
            <div className="flex items-center space-x-2">
              <p className="text-lg">packing list template</p>
              <InfoTooltip
                className="font-brand italic tracking-wide text-sm"
                theme="dark"
                width="w-60"
                content="Create a reusable packing list you can quickly copy into any trip."
              />
            </div>
            <Button.Primary
              onClick={() => setIsPackingListEditorOpen(true)}
              type="submit"
              className="mt-1 border border-secondary px-4 py-1 text-base transition ease-in-out duration-300"
            >
              {currentPackingList
                ? "Edit packing list template"
                : "Create packing list template"}
            </Button.Primary>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <p className="text-lg">preferred content view</p>
              <InfoTooltip
                className="font-brand italic tracking-wide text-sm"
                theme="dark"
                width="w-60"
                content="Choose how you'd like to view food and activity content by default. You can switch between gallery and list view anytime."
              />
            </div>
            <LocationViewSelector
              currentView={currentView}
              onChange={updateDefaultView}
            />
          </div>
        </div>
      </div>
      <PackingListTemplateEditor
        open={isPackingListEditorOpen}
        onClose={() => setIsPackingListEditorOpen(false)}
      />
    </>
  );
};

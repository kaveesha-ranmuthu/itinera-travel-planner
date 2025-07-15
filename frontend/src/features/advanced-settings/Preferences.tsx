import { useState } from "react";
import { twMerge } from "tailwind-merge";
import Button from "../../components/Button";
import InfoTooltip from "../../components/InfoTooltip";
import { auth } from "../../config/firebase-config";
import { useAuth } from "../../hooks/useAuth";
import { useHotToast } from "../../hooks/useHotToast";
import { useUpdateUserSettings } from "../../pages/trips/hooks/setters/useUpdateUserSettings";
import { Heading } from "./Heading";
import PackingListTemplateEditor from "./PackingListTemplateEditor";
import { ViewDisplayOptions } from "../../types/types";

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
            <div className="space-x-2">
              <Button.Primary
                onClick={() => updateDefaultView("gallery")}
                type="submit"
                className={twMerge(
                  "mt-1 border border-secondary hover:opacity-100 px-4 py-1 w-20 text-base transition ease-in-out duration-300",
                  currentView === "gallery" ? "opacity-100" : "opacity-60 "
                )}
                disabled={currentView === "gallery"}
              >
                Gallery
              </Button.Primary>
              <Button.Primary
                onClick={() => updateDefaultView("list")}
                type="submit"
                className={twMerge(
                  "mt-1 border border-secondary hover:opacity-100 px-4 py-1 w-20 text-base transition ease-in-out duration-300",
                  currentView === "list" ? "opacity-100" : "opacity-60"
                )}
                disabled={currentView === "list"}
              >
                List
              </Button.Primary>
            </div>
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

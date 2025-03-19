import { useState } from "react";
import { ChevronLeft, ChevronRight, MessageCircle, FileText, FileCheck, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "../lib/utils"

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("chat");

  return (
    <div
      className={cn(
        "h-full transition-all border-r bg-white dark:bg-slate-800 p-4 flex flex-col",
        collapsed ? "w-16" : "w-180"
      )}
    >
      <div className="flex items-center justify-between mb-4">
        {/* {!collapsed && (
          <h2 className="text-2xl font-bold text-primary">Invoice AI</h2>
        )} */}
        {!collapsed && (
        <p className="text-sm text-muted-foreground mb-8">
          As your personal assistant, I can help you with the following tasks...
        </p>
      )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="shrink-0"
        >
          {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </Button>
      </div>

      {/* {!collapsed && (
        // <p className="text-sm text-muted-foreground mb-8">
        //   Your personal invoice assistant
        // </p>
      )} */}

      <nav className="space-y-2 flex-1">
        <Button
          variant={activeTab === "chat" ? "default" : "ghost"}
          className="w-full justify-start"
          onClick={() => setActiveTab("chat")}
        >
          <MessageCircle className="mr-2 h-4 w-4" />
          {!collapsed && "AI Assistant"}
        </Button>
        <Button
          variant={activeTab === "generate" ? "default" : "ghost"}
          className="w-full justify-start"
          onClick={() => setActiveTab("generate")}
        >
          <FileText className="mr-2 h-4 w-4" />
          {!collapsed && "Generate Invoice"}
        </Button>
        <Button
          variant={activeTab === "reconcile" ? "default" : "ghost"}
          className="w-full justify-start"
          onClick={() => setActiveTab("reconcile")}
        >
          <FileCheck className="mr-2 h-4 w-4" />
          {!collapsed && "Reconcile PO & Invoice"}
        </Button>
      </nav>

      <div className="mt-auto pt-4 border-t">
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
            U
          </div>
          {!collapsed && (
            <div className="ml-2">
              <p className="text-sm font-medium">User Account</p>
            </div>
          )}
        </div>
        <Button variant="outline" size="sm" className="w-full">
          <Settings className="w-4 h-4 mr-2" />
          {!collapsed && "Settings"}
        </Button>
      </div>
    </div>
  );
}

export default Sidebar
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { MessageCircle, FileText, FileCheck } from "lucide-react"
// import InvoiceGeneration from "@/components/invoiceGeneration.jsx"
// import ReconcilePO from "@/components/reconcilePo.jsx"
// import ChatInterface from "@/components/chatInterface.jsx"
import InvoiceGeneration from "../components/invoiceGeneration"
import ReconcilePO from "../components/reconcilePo"
import ChatInterface from "../components/chatInterface"

export default function Home() {
  const [activeTab, setActiveTab] = useState("chat")
  const [message, setMessage] = useState("")

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Sidebar */}
      <div className="w-64 border-r bg-white dark:bg-slate-800 p-4 flex flex-col">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-primary">Invoice AI</h2>
          <p className="text-sm text-muted-foreground">Your personal invoice assistant</p>
        </div>

        <nav className="space-y-2 flex-1">
          <Button
            variant={activeTab === "chat" ? "default" : "ghost"}
            className="w-full justify-start"
            onClick={() => setActiveTab("chat")}
          >
            <MessageCircle className="mr-2 h-4 w-4" />
            AI Assistant
          </Button>
          <Button
            variant={activeTab === "generate" ? "default" : "ghost"}
            className="w-full justify-start"
            onClick={() => setActiveTab("generate")}
          >
            <FileText className="mr-2 h-4 w-4" />
            Generate Invoice
          </Button>
          <Button
            variant={activeTab === "reconcile" ? "default" : "ghost"}
            className="w-full justify-start"
            onClick={() => setActiveTab("reconcile")}
          >
            <FileCheck className="mr-2 h-4 w-4" />
            Reconcile PO & Invoice
          </Button>
        </nav>

        <div className="mt-auto pt-4 border-t">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
              U
            </div>
            <div className="ml-2">
              <p className="text-sm font-medium">User Account</p>
              {/* <p className="text-xs text-muted-foreground">Pro Plan</p> */}
            </div>
          </div>
          <Button variant="outline" size="sm" className="w-full">
            Settings
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="border-b bg-white dark:bg-slate-800 p-4">
          <h1 className="text-xl font-semibold">
            {activeTab === "chat" && "AI Assistant"}
            {activeTab === "generate" && "Generate Invoice from PO"}
            {activeTab === "reconcile" && "Reconcile PO & Invoice"}
          </h1>
        </header>

        <main className="flex-1 p-6 overflow-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsContent value="chat" className="mt-0">
              <ChatInterface />
            </TabsContent>
            <TabsContent value="generate" className="mt-0">
              <InvoiceGeneration />
            </TabsContent>
            <TabsContent value="reconcile" className="mt-0">
              <ReconcilePO />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}
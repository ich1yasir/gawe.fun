import ChatInterface from "../../../components/chat/ChatInterface";

const ChatPage: React.FC = () => {
  return (
    <div className="container mx-auto p-4 h-screen flex flex-col">
      <div className="mb-6">
        <h1 className="text-4xl font-bold">
          <span className="text-gray-900 dark:text-gray-200">Bi</span>
          <a href="/chat" className="text-blue-600 dark:text-blue-400 hover:cursor-pointer hover:underline">sik</a>
        </h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Your private sanctuary for secure conversations. Everything encrypted, nothing stored.
        </p>
      </div>
      
      <div className="flex-1">
        <ChatInterface />
      </div>
    </div>
  );
};

export default ChatPage;

import Dashboard from "../../../components/note/Dashboard";

const NotePage: React.FC = () => {
  return (
    <div className="container mx-auto p-4">

      <h1 className="text-4xl font-bold "><span className="text-gray-900 dark:text-gray-200">Ox</span><a href="/note" className="text-emerald-600 dark:text-emerald-400 hover:cursor-pointer hover:underline">Note</a></h1>
      {/* <p className="mt-0 text-base text-gray-600 dark:text-gray-400">
        This is your personal note. It is stored only on your computer—we do not store any data on our servers. The data is totally yours. If you lose access to your computer, your notes will be lost too.
      </p> */}
      {/* Future content for antrian management will go here */}
      {/* <CreateAntrian /> */}
      <Dashboard />
    </div>
  );
};

export default NotePage;

import CreateAntrian from "../../../components/antrian/CreateAntrian";
import Dashboard from "../../../components/note/Dashboard";

const AntrianPage: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Only Note</h1>
      <p className="mt-0 text-base text-gray-600 dark:text-gray-400">
        This is your personal note. It is stored only on your computer—we do not store any data on our servers. The data is totally yours. If you lose access to your computer, your notes will be lost too.
      </p>
      {/* Future content for antrian management will go here */}
      {/* <CreateAntrian /> */}
      <Dashboard />
    </div>
  );
};

export default AntrianPage;

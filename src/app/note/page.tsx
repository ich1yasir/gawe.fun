import CreateAntrian from "../../../components/antrian/CreateAntrian";
import Dashboard from "../../../components/note/Dashboard";

const AntrianPage: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Note</h1>
      <p className="text-lg text-gray-700 mb-6">
        Just simple note
      </p>
      {/* Future content for antrian management will go here */}
      {/* <CreateAntrian /> */}
      <Dashboard />
    </div>
  );
};

export default AntrianPage;

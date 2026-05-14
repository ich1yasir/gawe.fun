import CreateAntrian from "../../../components/antrian/CreateAntrian";

const AntrianPage: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Antrian Management System</h1>
      <p className="text-lg text-gray-700 mb-6">
        Manage your queues more flexibly and efficiently with our intuitive Antrian Management System.
      </p>
      {/* Future content for antrian management will go here */}
      <CreateAntrian />
    </div>
  );
};

export default AntrianPage;

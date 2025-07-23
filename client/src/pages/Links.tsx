const Links = () => {

  return (
    <div className="pb-20">
      <div className="p-4">
        <h1 className="text-2xl font-bold text-primary mb-4">Links</h1>
      </div>
      
      <div className="px-4">
        {/* Email */}
        <div className="bear-card text-center">
          <h3 className="font-medium text-lg mb-1">Email</h3>
          <p className="text-sm text-gray-600">deepdenebears@gmail.com</p>
        </div>
        
        {/* Wisdene Document */}
        <div className="bear-card">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium text-lg mb-1">Wisdene 2020-2021</h3>
            </div>
            <button className="bear-button text-sm">
              Click Here
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Links;

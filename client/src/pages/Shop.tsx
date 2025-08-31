import WebView from "@/components/WebView";

const Shop = () => {

  return (
    <div>
      <h2 className="text-xl font-heading font-bold px-4 py-3">Club Shop</h2>
      
      <div className="px-4 pb-20">
        <div className="h-[calc(100vh-120px)]">
          <WebView
            url="https://deepdenebearscc.square.site/s/shop"
            title="Deepdene Bears Club Shop"
            onClose={() => {}}
          />
        </div>
      </div>
    </div>
  );
};

export default Shop;
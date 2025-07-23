import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Shop = () => {
  const shopItems = [
    {
      id: 1,
      name: "Club Polo Shirt",
      price: "$55",
      description: "Official Deepdene Bears polo shirt with embroidered logo",
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80",
      sizes: ["S", "M", "L", "XL", "XXL"]
    },
    {
      id: 2,
      name: "Training Cap",
      price: "$25",
      description: "Breathable cap with club logo for training and casual wear",
      image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80",
      sizes: ["One Size"]
    },
    {
      id: 3,
      name: "Club Hoodie",
      price: "$75",
      description: "Warm hoodie perfect for cool weather training sessions",
      image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80",
      sizes: ["S", "M", "L", "XL", "XXL"]
    },
    {
      id: 4,
      name: "Playing Kit",
      price: "$120",
      description: "Complete playing uniform - shirt, pants, and cap",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80",
      sizes: ["S", "M", "L", "XL", "XXL"]
    },
    {
      id: 5,
      name: "Club Scarf",
      price: "$30",
      description: "Show your support with this classic club scarf",
      image: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80",
      sizes: ["One Size"]
    },
    {
      id: 6,
      name: "Water Bottle",
      price: "$15",
      description: "Insulated sports bottle with club branding",
      image: "https://images.unsplash.com/photo-1523362628745-0c100150b504?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80",
      sizes: ["500ml"]
    }
  ];

  return (
    <div>
      <h2 className="text-xl font-heading font-bold px-4 py-3">Club Shop</h2>
      
      <div className="px-4 pb-20">
        <Card className="mb-4">
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="font-semibold mb-2 text-primary">Official Club Merchandise</h3>
              <p className="text-sm text-neutral-600">
                Show your Bears pride with our range of official club merchandise. 
                All proceeds support our junior development programs.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {shopItems.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <div className="aspect-square overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="pt-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-sm">{item.name}</h3>
                  <span className="text-primary font-bold">{item.price}</span>
                </div>
                <p className="text-xs text-neutral-600 mb-3">{item.description}</p>
                
                <div className="mb-3">
                  <p className="text-xs font-medium mb-1">Available sizes:</p>
                  <div className="flex flex-wrap gap-1">
                    {item.sizes.map((size) => (
                      <span 
                        key={size}
                        className="px-2 py-1 bg-neutral-100 text-xs rounded"
                      >
                        {size}
                      </span>
                    ))}
                  </div>
                </div>
                
                <Button size="sm" className="w-full">
                  <i className="ri-shopping-cart-line mr-2"></i>
                  Add to Cart
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mb-4">
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-3 text-primary">Ordering Information</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start">
                <i className="ri-truck-line text-primary mr-3 mt-1"></i>
                <div>
                  <p className="font-medium">Delivery</p>
                  <p className="text-neutral-600">Free pickup at training. $10 delivery within Melbourne.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <i className="ri-time-line text-primary mr-3 mt-1"></i>
                <div>
                  <p className="font-medium">Processing Time</p>
                  <p className="text-neutral-600">2-3 weeks for custom embroidered items. Stock items ship within 5 days.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <i className="ri-exchange-line text-primary mr-3 mt-1"></i>
                <div>
                  <p className="font-medium">Returns</p>
                  <p className="text-neutral-600">Exchanges accepted within 14 days with tags attached.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-4">
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-3 text-primary">Payment Methods</h3>
            <div className="flex justify-around items-center py-2">
              <div className="text-center">
                <i className="ri-bank-card-line text-2xl text-primary mb-1"></i>
                <p className="text-xs">Credit Card</p>
              </div>
              <div className="text-center">
                <i className="ri-bank-line text-2xl text-primary mb-1"></i>
                <p className="text-xs">Bank Transfer</p>
              </div>
              <div className="text-center">
                <i className="ri-wallet-line text-2xl text-primary mb-1"></i>
                <p className="text-xs">PayPal</p>
              </div>
              <div className="text-center">
                <i className="ri-money-dollar-circle-line text-2xl text-primary mb-1"></i>
                <p className="text-xs">Cash</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-3 text-primary">Questions?</h3>
            <div className="space-y-2 text-sm">
              <p>Need help with sizing or have a custom request?</p>
              <div className="flex items-center">
                <i className="ri-mail-line text-lg text-primary mr-3"></i>
                <a href="mailto:shop@deepdenebears.com" className="text-primary hover:underline">
                  shop@deepdenebears.com
                </a>
              </div>
              <div className="flex items-center">
                <i className="ri-phone-line text-lg text-primary mr-3"></i>
                <a href="tel:+61398765432" className="text-primary hover:underline">
                  +61 3 9876 5432
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Shop;
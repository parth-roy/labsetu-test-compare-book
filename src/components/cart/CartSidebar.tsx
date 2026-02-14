import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/hooks/useCart";
import { ShoppingCart, Trash2, FlaskConical } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CartSidebar = () => {
  const { items, removeItem, clearCart, totalPrice, itemCount } = useCart();
  const navigate = useNavigate();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="relative gap-2">
          <ShoppingCart className="h-4 w-4" />
          <span className="hidden sm:inline">Cart</span>
          {itemCount > 0 && (
            <Badge className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full p-0 text-xs">
              {itemCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="flex w-full flex-col sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Your Cart ({itemCount})
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 text-muted-foreground">
            <FlaskConical className="h-12 w-12 opacity-40" />
            <p>Your cart is empty</p>
            <p className="text-sm">Search and add tests to get started</p>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-3 overflow-y-auto py-4">
              {items.map((item) => (
                <div key={item.labTestId} className="flex items-start justify-between rounded-lg border p-3">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{item.testName}</p>
                    <p className="text-xs text-muted-foreground">{item.labName} · {item.labCity}</p>
                    {item.turnaroundHours && (
                      <p className="text-xs text-muted-foreground mt-1">Results in {item.turnaroundHours}h</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-primary">₹{item.price}</span>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => removeItem(item.labTestId)}>
                      <Trash2 className="h-3.5 w-3.5 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-3">
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-primary">₹{totalPrice}</span>
              </div>
              <Button className="w-full" onClick={() => navigate("/checkout")}>
                Proceed to Book ({itemCount} tests)
              </Button>
              <Button variant="ghost" size="sm" className="w-full text-destructive" onClick={clearCart}>
                Clear Cart
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartSidebar;

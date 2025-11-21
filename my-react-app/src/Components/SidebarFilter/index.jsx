import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { motion, AnimatePresence } from "framer-motion";
import { X, Filter, Loader2 } from "lucide-react";
import "./SidebarFilter.scss"; // 👈 import the CSS file

export default function SidebarFilter() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [priceRange, setPriceRange] = useState([2000]);
  const [brand, setBrand] = useState("");
  const [type, setType] = useState("");
  const [year, setYear] = useState("all");

  const toggleSidebar = () => setIsOpen(!isOpen);

  const handleSearch = () => {
    setIsLoading(true);

    // Simulate API/filter process
    setTimeout(() => {
      setIsLoading(false);
      setIsOpen(false);
      console.log("Searching with filters:", { priceRange, brand, type, year });
    }, 2000);
  };

  return (
    <div className="relative">
      {/* Filter Button */}
      <Button
        variant="outline"
        onClick={toggleSidebar}
        className="flex items-center gap-2 text-gray-800 bg-white border border-gray-300 shadow-sm hover:bg-gray-100"
      >
        <Filter size={18} /> Filters
      </Button>

      {/* Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <motion.div
              className="fixed inset-0 z-[9998] bg-black/40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleSidebar}
            />

            {/* Sidebar Panel */}
            <motion.div
              className="sidebar-panel fixed top-0 right-0 z-[9999] flex flex-col h-full p-6 bg-white shadow-2xl w-80"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Filter Bikes</h2>
                <Button variant="ghost" size="icon" onClick={toggleSidebar}>
                  <X size={20} />
                </Button>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <label className="block mb-2 font-medium">Price Range (₹)</label>
                <Slider
                  value={priceRange}
                  onValueChange={setPriceRange}
                  min={500}
                  max={20000}
                  step={500}
                />
                <p className="mt-1 text-sm text-gray-500">
                  Up to ₹{priceRange[0].toLocaleString()}
                </p>
              </div>

              {/* Brand */}
              <div className="mb-6">
                <label className="block mb-2 font-medium">Brand</label>
                <select
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="">All Brands</option>
                  <option value="honda">Honda</option>
                  <option value="yamaha">Yamaha</option>
                  <option value="suzuki">Suzuki</option>
                  <option value="ktm">KTM</option>
                  <option value="hero">Hero</option>
                </select>
              </div>

              {/* Type */}
              <div className="mb-6">
                <label className="block mb-2 font-medium">Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="">All Types</option>
                  <option value="sport">Sport</option>
                  <option value="cruiser">Cruiser</option>
                  <option value="scooter">Scooter</option>
                  <option value="electric">Electric</option>
                </select>
              </div>

              {/* Year */}
              <div className="mb-6">
                <label className="block mb-2 font-medium">Model Year</label>
                <select
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="all">All Years</option>
                  {Array.from({ length: 10 }).map((_, i) => {
                    const yr = 2025 - i;
                    return (
                      <option key={yr} value={yr}>
                        {yr}
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Search Button */}
              <Button
                onClick={handleSearch}
                disabled={isLoading}
                className="flex items-center justify-center w-full gap-2 mt-auto"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Searching...
                  </>
                ) : (
                  "Search"
                )}
              </Button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

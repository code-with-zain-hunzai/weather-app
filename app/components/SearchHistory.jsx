import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { History, MapPin } from "lucide-react";

export default function SearchHistory({ historyData, onSelectCity }) {
  if (!historyData || historyData.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <History size={18} />
          <CardTitle>Search History</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {historyData.slice().reverse().map((location, index) => (
            <Button
              key={index}
              className="truncate justify-start"
              onClick={() => onSelectCity(location.name)}
            >
              <MapPin size={14} className="mr-2 flex-shrink-0" />
              <span className="truncate">{location.name}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
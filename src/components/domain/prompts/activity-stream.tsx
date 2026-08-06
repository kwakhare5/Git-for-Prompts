import { GitBranch, Sparkles, CheckCircle2, Clock } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';

export interface ActivityEvent {
  id: string;
  type: 'version' | 'test' | 'prompt';
  title: string;
  subtitle: string;
  timestamp: Date;
  status?: string;
}

interface ActivityStreamProps {
  events: ActivityEvent[];
}

export function ActivityStream({ events }: ActivityStreamProps) {
  return (
    <Card className="flex flex-col font-sans border-border bg-card shadow-sm h-full">
      <CardHeader className="p-4 border-b border-border bg-muted/20 pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold tracking-tight text-foreground flex items-center gap-2 font-sans">
            <Clock className="w-4 h-4 text-muted-foreground" />
            Live Activity Stream
          </CardTitle>
          <Badge variant="outline" className="text-xs font-sans text-emerald-400 border-emerald-500/20 bg-emerald-500/10">
            Realtime
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-1 space-y-4 overflow-y-auto max-h-[520px]">
        {events.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground text-xs font-sans">
            No activity logged yet.
          </div>
        ) : (
          events.map((evt) => (
            <div key={evt.id} className="flex items-start gap-3 text-xs font-sans group">
              <div className="p-1.5 rounded-md bg-muted border border-border text-muted-foreground group-hover:text-foreground transition-colors shrink-0 mt-0.5">
                {evt.type === 'version' ? (
                  <GitBranch className="w-3.5 h-3.5" />
                ) : evt.type === 'test' ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-foreground truncate font-sans">{evt.title}</span>
                  <span className="text-[10px] font-mono text-muted-foreground shrink-0">
                    {formatDistanceToNow(new Date(evt.timestamp), { addSuffix: true })}
                  </span>
                </div>
                <p className="text-muted-foreground truncate text-[11px] font-mono mt-0.5">{evt.subtitle}</p>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}

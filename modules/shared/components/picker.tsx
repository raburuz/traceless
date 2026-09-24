import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "cn";
import { ScrollArea } from "@/components/ui/scroll-area";

export const FormPicker = (
  props: {
    title: string,
    items: readonly string[],
    current: string,
    render: ( item: string ) => React.ReactElement,
    onChange: ( value: string ) => void,
    icon?: React.ReactElement,
    containerListClassname?: string,
    containerClassname?: string,
  }
) => {

  const [open, setOpen] = useState(false);

  return (
    <Popover 
      open={open} 
      onOpenChange={setOpen}
    >
      <PopoverTrigger
        render={
          <Button 
            type="button" 
            variant="ghost" 
            className="h-9 rounded-full border border-zinc-100 bg-white px-3 text-zinc-900 hover:bg-zinc-50 dark:bg-white dark:hover:bg-zinc-50"
          />
        }
      >
        {props.icon}
        {props.current}
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-64 rounded-2xl border border-zinc-100 bg-white p-4 pr-0.5 text-zinc-900 shadow-lg ring-0 dark:bg-white"
      >
        <p className="mb-3 text-sm text-zinc-500">{props.title}</p>
        <ScrollArea>
          <div className={cn("grid grid-cols-1 gap-2 p-0.5 max-h-75 pr-3.5", props.containerListClassname)}>
            {  
              props.items.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => {
                    props.onChange(item);
                    setOpen(false);
                  }}
                  className={cn(
                    "flex h-10 items-center justify-between rounded-xl px-3 text-sm text-zinc-600 transition-colors hover:bg-zinc-100",
                    item === props.current
                      ? "bg-zinc-100 text-zinc-900 ring-1 ring-zinc-200 hover:bg-zinc-100"
                      : "bg-zinc-50",
                    props.containerClassname
                  )}
                >
                  {props.render(item)}
                </button>
              )) 
            }
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};
"use client"

import { Input } from "@/components/ui/input"
import { CircleCheck, Info, Loader } from "lucide-react"
import { useEffect, useState } from "react"
import { useDebounceValue } from "usehooks-ts"
import { checkUserName } from "@/app/actions/username-actions"
import { cn } from "@/lib/utils"

export default function HomePage() {
  const [isTaken, setIsTaken] = useState(false)
  const [isPending, setIsPending] = useState(false)
  const [userName, setUserName] = useDebounceValue("", 300)

  const onSubmit = async () => {
    if (!userName.length) return

    try {
      setIsPending(true)
      const response = await checkUserName({ username: userName })
      setIsTaken(response)
    } finally {
      setIsPending(false)
    }
  }

  useEffect(() => {
    onSubmit()
  }, [userName])

  return (
    <section className="w-full min-h-screen flex items-center justify-center">
      <div>
        <div className="flex items-start flex-col gap-3">
          <label className="text-sm leading-none font-medium">Username</label>
          <div className="flex flex-col gap-2">
            <Input
              type="text"
              onChange={(event) => setUserName(event.target.value)}
              placeholder="enter your username here..."
              className=""
            />
            {!!userName.length ? (
              <span
                className={cn(
                  " text-xs flex gap-1 items-center",
                  isPending && userName
                    ? "text-yellow-500"
                    : isTaken
                    ? "text-red-500"
                    : "text-green-500"
                )}
              >
                {isPending ? (
                  <Loader className="size-3 animate-spin" />
                ) : isTaken ? (
                  <CircleCheck className="size-3" />
                ) : (
                  <Info className="size-3" />
                )}

                {isPending
                  ? "Checking availablility..."
                  : isTaken
                  ? "username already in use."
                  : "username is available"}
              </span>
            ) : (
              <span className="h-3.5" />
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

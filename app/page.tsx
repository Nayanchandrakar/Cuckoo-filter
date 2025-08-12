"use client"

import { useState, useEffect, useCallback } from "react"
import { Input } from "@/components/ui/input"
import { CircleCheck, Info, Loader } from "lucide-react"
import { useDebounceValue } from "usehooks-ts"
import { checkUserName } from "@/app/actions/username-actions"
import { cn } from "@/lib/utils"

const statusConfig = {
  pending: {
    color: "text-white",
    icon: <Loader className="size-3 animate-spin" />,
    message: "Checking availability...",
  },
  taken: {
    color: "text-red-500",
    icon: <CircleCheck className="size-3" />,
    message: "Username already in use.",
  },
  available: {
    color: "text-green-500",
    icon: <Info className="size-3" />,
    message: "Username is available.",
  },
}

export default function HomePage() {
  const [isPending, setIsPending] = useState(false)
  const [inputValue, setInputValue] = useDebounceValue("", 300)
  const [isUsernameTaken, setIsUsernameTaken] = useState<boolean | null>(null)

  const onInputChange = useCallback(async () => {
    if (!inputValue.length) return

    try {
      setIsPending(true)
      const response = await checkUserName({ username: inputValue })
      setIsUsernameTaken(response)
    } catch {
      setIsUsernameTaken(null)
    } finally {
      setIsPending(false)
    }
  }, [inputValue])

  useEffect(() => {
    onInputChange()
  }, [inputValue])

  let status = null
  if (isPending) status = statusConfig.pending
  else if (isUsernameTaken) status = statusConfig.taken
  else if (isUsernameTaken === false) status = statusConfig.available

  return (
    <section className="w-full min-h-screen flex items-center justify-center">
      <div>
        <div className="flex flex-col gap-3">
          <label
            htmlFor="username"
            className="text-sm leading-none font-medium"
          >
            Username
          </label>
          <div className="flex flex-col gap-2">
            <Input
              type="text"
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter your username here..."
            />
            <span
              className={cn(
                "text-xs flex invisible gap-1 items-center transition-all duration-400",
                status?.color,
                inputValue && "visible"
              )}
            >
              {status?.icon}
              {status?.message}
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}

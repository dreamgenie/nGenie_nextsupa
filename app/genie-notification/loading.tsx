export default function Loading() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-darkBlue">
      <div className="flex flex-col items-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        <p className="mt-4 text-white">Loading Notifications...</p>
      </div>
    </div>
  )
}

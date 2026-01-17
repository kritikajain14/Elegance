const Loader = () => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <div className="loading-spinner mx-auto mb-4"></div>
        <p className="text-primary-500/70">Loading...</p>
      </div>
    </div>
  )
}

export default Loader
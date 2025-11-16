import LoaderData from "../loader/loader.svg"

export default function Loader({alt}) {
  const showHideClassName = alt ? "grid" : "grid h-screen-custom place-items-center";

  return (
    <div className={showHideClassName}>
      <img className="w-28 h-28" src={LoaderData} />
    </div>
    
  )
}
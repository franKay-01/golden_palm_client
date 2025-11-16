import Navbar from "../components/navbar";
import GalleryImg from "../assets/gallery_img.png"
import Footer from "../components/footer";

export default function Gallery(){
  return (
    <div className="min-h-screen relative">
      <Navbar/>
      <main className="main-home-content">
        <div className="grid mt-12">
          <div className="flex flex-row space-x-8">
            <h1 className="header-colored-text header-colored-text-alt-2">Blog</h1>
          </div>
        </div>
        <div className="container main-container">
          <hr className="default-alt-2"></hr>
        </div>
        <div className="container grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 mt-4 gap-8 justify-center items-center ">
          <div className='flex flex-col gap-4 w-11/12'>
            <img src={GalleryImg} alt="article img" className='media-fit-image'/>
            <div className='flex justify-between items-center'>
              <h1 className='date-text'>Sep 18, 2022</h1>
              <h1>By: Clayton Tucker</h1>
            </div>
            <h1 className='blog-title'>It was popularised inner the with the release of containing.</h1>
            <p>Making this the first true generator on the Internet dictionary of over combined.</p>
            <button className='blog-details-link'>
              Read more
            </button>
          </div>
          <div className='flex flex-col gap-4'>
            <img src={GalleryImg} alt="article img" className='media-fit-image'/>
            <div className='flex justify-between items-center'>
              <h1 className='date-text'>Sep 18, 2022</h1>
              <h1>By: Clayton Tucker</h1>
            </div>
            <h1 className='blog-title'>It was popularised inner the with the release of containing.</h1>
            <p>Making this the first true generator on the Internet dictionary of over combined.</p>
            <button className='blog-details-link'>
              Read more
            </button>
          </div>
          <div className='flex flex-col gap-4'>
            <img src={GalleryImg} alt="article img" className='media-fit-image'/>
            <div className='flex justify-between items-center'>
              <h1 className='date-text'>Sep 18, 2022</h1>
              <h1>By: Clayton Tucker</h1>
            </div>
            <h1 className='blog-title'>It was popularised inner the with the release of containing.</h1>
            <p>Making this the first true generator on the Internet dictionary of over combined.</p>
            <button className='blog-details-link'>
              Read more
            </button>
          </div>
        </div>
        <div className="flex flex-col space-y-4 p-4 mt-12 justify-center items-center lg:hidden md:hidden">
          <div className="grid grid-cols-1">
            <img class="object-cover image-width h-full" src='https://images.unsplash.com/photo-1666147775717-65fa1fe0c47b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NjY2NDMxNzc&ixlib=rb-4.0.3&q=80&w=400' alt=''/>
            <p className="gallery-text gallery-text-auto"><b>Central California</b> — The person who grew these was located in Central California and, er, hopefully very well-compensated.</p>
          </div>
          <div>
            <img class="object-cover image-width h-full" src='https://images.unsplash.com/photo-1665561741359-7af2d2fdc395?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NjY2NDMxNzc&ixlib=rb-4.0.3&q=80&w=400' alt=''/>
            <p className="gallery-text gallery-text-auto"><b>Central California</b> — The person who grew these was located in Central California and, er, hopefully very well-compensated.</p>
          </div>
          <div className="grid grid-cols-1">
            <img class="object-cover image-width h-full" src='https://images.unsplash.com/photo-1666147775717-65fa1fe0c47b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NjY2NDMxNzc&ixlib=rb-4.0.3&q=80&w=400' alt=''/>
            <p className="gallery-text gallery-text-auto"><b>Central California</b> — The person who grew these was located in Central California and, er, hopefully very well-compensated.</p>
          </div>
          <div>
            <img class="object-cover image-width h-full" src='https://images.unsplash.com/photo-1665561741359-7af2d2fdc395?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NjY2NDMxNzc&ixlib=rb-4.0.3&q=80&w=400' alt=''/>
            <p className="gallery-text gallery-text-auto"><b>Central California</b> — The person who grew these was located in Central California and, er, hopefully very well-compensated.</p>
          </div>
        </div>
        <div class="max-w-screen-2xl mx-auto mt-12 px-4 relative bg-white hidden lg:block md:block">
          <div class="flex flex-col md:flex-row gap-2 scrollable-div scroll-pt-20	">
            <div class="flex flex-1 flex-col item">
              <div class="flex flex-1 flex-col">
                <img class="object-cover h-full image-width" src='https://images.unsplash.com/photo-1664764119004-999a3f80a1b8?crop=entropy&cs=tinysrgb&fm=jpg&ixid=MnwzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NjY2NDEzMDc&ixlib=rb-4.0.3&q=80' alt=''/>
                <p className="gallery-text gallery-text-auto mb-8"><b>Central California</b> — The person who grew these was located in<br></br>Central California and, er, hopefully very well-compensated.</p>
              </div>
            </div>
            <div class="flex flex-col item">
              <div class="grid grid-cols-1">
                <div className="grid grid-cols-1">
                  <img class="object-cover image-width h-full" src='https://images.unsplash.com/photo-1666147775717-65fa1fe0c47b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NjY2NDMxNzc&ixlib=rb-4.0.3&q=80&w=400' alt=''/>
                  <p className="gallery-text gallery-text-auto"><b>Central California</b> — The person who grew these was located in<br></br>Central California and, er, hopefully very well-compensated.</p>
                </div>
                <div>
                  <img class="object-cover image-width h-full" src='https://images.unsplash.com/photo-1665561741359-7af2d2fdc395?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NjY2NDMxNzc&ixlib=rb-4.0.3&q=80&w=400' alt=''/>
                  <p className="gallery-text gallery-text-auto"><b>Central California</b> — The person who grew these was located in<br></br>Central California and, er, hopefully very well-compensated.</p>
                </div>
              </div>
            </div>
            <div class="flex flex-1 flex-col item">
              <div class="flex flex-1 flex-col">
                <img class="object-cover h-full image-width" src='https://images.unsplash.com/photo-1664764119004-999a3f80a1b8?crop=entropy&cs=tinysrgb&fm=jpg&ixid=MnwzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NjY2NDEzMDc&ixlib=rb-4.0.3&q=80' alt=''/>
                <p className="gallery-text gallery-text-auto mb-8"><b>Central California</b> — The person who grew these was located in<br></br>Central California and, er, hopefully very well-compensated.</p>
              </div>
            </div>
            <div class="flex flex-col item">
              <div class="grid grid-cols-1">
                <div className="grid grid-cols-1">
                  <img class="object-cover image-width h-full" src='https://images.unsplash.com/photo-1666147775717-65fa1fe0c47b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NjY2NDMxNzc&ixlib=rb-4.0.3&q=80&w=400' alt=''/>
                  <p className="gallery-text gallery-text-auto"><b>Central California</b> — The person who grew these was located in<br></br>Central California and, er, hopefully very well-compensated.</p>
                </div>
                <div>
                  <img class="object-cover image-width h-full" src='https://images.unsplash.com/photo-1665561741359-7af2d2fdc395?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NjY2NDMxNzc&ixlib=rb-4.0.3&q=80&w=400' alt=''/>
                  <p className="gallery-text gallery-text-auto"><b>Central California</b> — The person who grew these was located in<br></br>Central California and, er, hopefully very well-compensated.</p>
                </div>
              </div>
            </div>
            <div class="flex flex-1 flex-col item">
              <div class="flex flex-1 flex-col">
                <img class="object-cover h-full image-width" src='https://images.unsplash.com/photo-1664764119004-999a3f80a1b8?crop=entropy&cs=tinysrgb&fm=jpg&ixid=MnwzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NjY2NDEzMDc&ixlib=rb-4.0.3&q=80' alt=''/>
                <p className="gallery-text gallery-text-auto mb-8"><b>Central California</b> — The person who grew these was located in<br></br>Central California and, er, hopefully very well-compensated.</p>
              </div>
            </div>
            <div class="flex flex-col item">
              <div class="grid grid-cols-1">
                <div className="grid grid-cols-1">
                  <img class="object-cover image-width h-full" src='https://images.unsplash.com/photo-1666147775717-65fa1fe0c47b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NjY2NDMxNzc&ixlib=rb-4.0.3&q=80&w=400' alt=''/>
                  <p className="gallery-text gallery-text-auto"><b>Central California</b> — The person who grew these was located in<br></br>Central California and, er, hopefully very well-compensated.</p>
                </div>
                <div>
                  <img class="object-cover image-width h-full" src='https://images.unsplash.com/photo-1665561741359-7af2d2fdc395?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NjY2NDMxNzc&ixlib=rb-4.0.3&q=80&w=400' alt=''/>
                  <p className="gallery-text gallery-text-auto"><b>Central California</b> — The person who grew these was located in<br></br>Central California and, er, hopefully very well-compensated.</p>
                </div>
              </div>
            </div>
            <div class="flex flex-1 flex-col item">
              <div class="flex flex-1 flex-col">
                <img class="object-cover h-full image-width" src='https://images.unsplash.com/photo-1664764119004-999a3f80a1b8?crop=entropy&cs=tinysrgb&fm=jpg&ixid=MnwzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NjY2NDEzMDc&ixlib=rb-4.0.3&q=80' alt=''/>
                <p className="gallery-text gallery-text-auto mb-8"><b>Central California</b> — The person who grew these was located in<br></br>Central California and, er, hopefully very well-compensated.</p>
              </div>
            </div>
            <div class="flex flex-col item">
              <div class="grid grid-cols-1">
                <div className="grid grid-cols-1">
                  <img class="object-cover image-width h-full" src='https://images.unsplash.com/photo-1666147775717-65fa1fe0c47b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NjY2NDMxNzc&ixlib=rb-4.0.3&q=80&w=400' alt=''/>
                  <p className="gallery-text gallery-text-auto"><b>Central California</b> — The person who grew these was located in<br></br>Central California and, er, hopefully very well-compensated.</p>
                </div>
                <div>
                  <img class="object-cover image-width h-full" src='https://images.unsplash.com/photo-1665561741359-7af2d2fdc395?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NjY2NDMxNzc&ixlib=rb-4.0.3&q=80&w=400' alt=''/>
                  <p className="gallery-text gallery-text-auto"><b>Central California</b> — The person who grew these was located in<br></br>Central California and, er, hopefully very well-compensated.</p>
                </div>
              </div>
            </div>
          </div>
          <div class="pseduo-track"></div>
        </div>
        <div className="container">
          <img className="mt-12" src={GalleryImg} alt=""/>
        </div>
        <div className="flex flex-col main-container mt-8 lg:mt-24 md:mt-12">
          <h1 className="lg:hidden md:hidden header-colored-text">Best quality right from the heart of Africa</h1>
          <h1 className="hidden lg:block md:block header-colored-text">Best quality right from the heart<br></br>of Africa</h1>
        </div>
        <div className="container flex justify-center">
          <p className="recipe-p recipe-p-alt">
            We believe in produce. Tasty produce. Produce like:
            <br></br><br></br>
            Apples. Oranges. Limes. Lemons. Guavas. Carrots. Cucumbers. Jicamas. Cauliflowers. Brussels sprouts. Shallots. Japanese eggplants. Asparagus. Artichokes—Jerusalem artichokes, too. Radishes. Broccoli. Baby broccoli. Broccolini. Bok choy. Scallions. Ginger. Cherries. Raspberries. Cilantro. Parsley. Dill. 
            <br></br><br></br>
            What are we forgetting?
            <br></br><br></br>
            Oh! Onions. Yams. Avocados. Lettuce. Arugula (to some, “rocket”). Persian cucumbers, in addition to aforementioned “normal” cucumbers. Artichokes. Zucchinis. Pumpkins. Squash (what some cultures call pumpkins). Sweet potatoes and potato-potatoes. Jackfruit. Monk fruit. Fruit of the Loom. Fruits of our labor (this website). Sorrel. Pineapple. Mango. Gooseberries. Blackberries. Tomatoes. Heirloom tomatoes. Beets. Chives. Corn. Endive. Escarole, which, we swear, we’re vendors of organic produce, but if you asked us to describe what escaroles are...
          </p>
        </div>
      </main>
      <Footer/>
    </div>
  )
}
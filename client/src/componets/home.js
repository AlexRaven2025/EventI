import './home.css'
import myImage from '../images/img1.jpg';


export const Home = () => {
        return (
            <div className="Wrapper">
            <div className="group-container">
              <img src={myImage} alt="group" />
            </div>
          </div>
        );
      }
export default Home;
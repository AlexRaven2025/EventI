import './home.css'
import { Link } from "react-router-dom";
export const Home = () => {
        return (
          <div className="home-container">
          
    
          <section className="hero">
            <div className="hero-content">
              <h1>Welcome to the Event Manager</h1>
              <p>Plan, Organize, and Manage Your Events with Ease</p>
              <Link to='/events' className="cta-button">Explore Events</Link>
            </div>
          </section>
    
          <section className="features">
            <div className="feature">
              <h2>Event Planning Made Easy</h2>
              <p>Efficiently plan and schedule events, ensuring all details are covered.</p>
            </div>
            <div className="feature">
              <h2>Streamline Event Registration</h2>
              <p>Provide a seamless registration process for attendees with online forms.</p>
            </div>
            <div className="feature">
              <h2>Manage Event Participants</h2>
              <p>Easily manage and communicate with event participants and track attendance.</p>
            </div>
          </section>
    
          <footer className="footer">
            <p>&copy; {new Date().getFullYear()} Event Manager. All rights reserved.</p>
          </footer>
        </div>
      );
    }
export default Home;
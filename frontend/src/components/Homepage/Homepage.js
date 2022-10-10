import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import LoginSignupModal from "../LoginSignupModal";
import "./Homepage.css";

const Homepage = () => {
  const activeSession = useSelector((state) => state.session.user);

  return (
    <div className="homepage-container">
      <div className="header-container">
        <div className="header-left">
          <h1>Celebrating 20 years of real connections on RendeVue</h1>
          <p>
            Whatever you're looking to do this year, RendeVue can help. For 20
            years, people have turned to RendeVue to meet people, make friends,
            find support, grow a business, and explore their interests.
            Thousands of events are happening every day—join the fun.
          </p>
        </div>
        <div className="header-right">
          <img
            src="https://secure.meetupstatic.com/next/images/shared/online_events.svg?w=1080"
            alt="https://secure.meetupstatic.com/next/images/shared/online_events.svg?w=1080"
          />
        </div>
      </div>

      <div className="header-images">
        <div className="make-friends">
          <img
            src="https://secure.meetupstatic.com/next/images/indexPage/category1.webp?w=3840"
            alt="https://secure.meetupstatic.com/next/images/indexPage/category1.webp?w=3840"
          />
          <h3>Make new friends</h3>
        </div>
        <div className="explore-outdoors">
          <img
            src="https://secure.meetupstatic.com/next/images/indexPage/category2.webp?w=3840"
            alt="https://secure.meetupstatic.com/next/images/indexPage/category2.webp?w=3840"
          />
          <h3>Explore the outdoors</h3>
        </div>
        <div className="connect">
          <img
            src="https://secure.meetupstatic.com/next/images/indexPage/category3.webp?w=3840"
            alt="https://secure.meetupstatic.com/next/images/indexPage/category3.webp?w=3840"
          />
          <h3>Connect over tech</h3>
        </div>
      </div>

      <div className="body-description">
        <h2>How RendeVue works</h2>
        <p>
          Meet new people who share your interests through online and in-person
          events. It's free to create an account.
        </p>
        <div className="body-links">
          <div className="join-group">
            <img
              src="https://secure.meetupstatic.com/next/images/shared/handsUp.svg?w=384"
              alt="https://secure.meetupstatic.com/next/images/shared/handsUp.svg?w=384"
            />
            <Link to="/groups">
              <h3>Join a group</h3>
            </Link>
            <p>
              Do what you love, meet others who love it, find your community.
              The rest is history!
            </p>
          </div>
          <div className="find-event">
            <img
              src="https://secure.meetupstatic.com/next/images/shared/ticket.svg?w=384"
              alt="https://secure.meetupstatic.com/next/images/shared/ticket.svg?w=384"
            />
            <Link to="/events">
              <h3>Find an event</h3>
            </Link>
            <p>
              Events are happening on just about any topic you can think of,
              from online gaming and photography to yoga and hiking.
            </p>
          </div>
          <div className="start-group">
            <img
              src="https://secure.meetupstatic.com/next/images/shared/joinGroup.svg?w=384"
              alt="https://secure.meetupstatic.com/next/images/shared/joinGroup.svg?w=384"
            />
            {activeSession ? (
              <Link to="/groups/new">
                <h3>Start a group</h3>
              </Link>
            ) : (
              <LoginSignupModal area="start" />
            )}
            <p>
              You don't have to be an expert to gather people together and
              explore shared interests.
            </p>
          </div>
        </div>
      </div>

      <LoginSignupModal area="join" />
      {/* <button className="join-meetup">
        <Link to="/signup">Join RendeVue</Link>
      </button> */}
    </div>
  );
};

export default Homepage;

import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { getGroups } from "../../store/groups";
import { getSessionGroups } from "../../store/session";
import "./Groups.css";

const GroupsIndex = () => {
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const groups = useSelector((state) =>
    Object.values(pathname === "/groups" ? state.groups : state.session.groups)
  );
  const groupsRef = useRef([]);
  const [isVisible, setIsVisible] = useState({});

  // if (groupsRef.current.length !== groups.length) {
  //   // add or remove refs
  //   groupsRef.current = Array(groups.length)
  //     .fill()
  //     .map((_, i) => groupsRef.current[i] || createRef());
  // }

  // useEffect(() => {
  //   groupsRef.current = groupsRef.current.slice(0, groups.length);
  // }, [groups]);

  // useEffect(() => {
  //   console.log("groups", groups);

  //   console.log("groupsRef", groupsRef.current);

  // groupsRef.current.forEach((el) => {
  //   console.log(el);
  //   observer.observe(el);
  // });

  // if (groupsRef.current.length) observer.observe(groupsRef.current[0]);

  // if (groupsRef.current.length) observer.observe(groupsRef?.current?.[0]);
  // return () => {
  //   groupsRef.current.forEach((el) => {
  //     observer.unobserve(el);
  //   });
  // };
  // }, [groups]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, idx) => {
          setIsVisible((state) => ({
            ...state,
            [entry.target]: entry.isIntersecting,
          }));
        });
        // setIsVisible(entries.map((entry) => entry.isIntersecting));
      },
      { threshold: 1 }
    );

    (async () => {
      try {
        await dispatch(
          pathname === "/groups" ? getGroups() : getSessionGroups()
        );

        groupsRef.current.forEach((el) => {
          observer.observe(el);
        });
      } catch {}
    })();
  }, [dispatch, pathname]);

  // useEffect(() => {
  //   pathname === "/groups"
  //     ? (async () => dispatch(getGroups()))()
  //     : (async () => dispatch(getSessionGroups()))();
  // }, [dispatch, pathname]);

  return (
    groups && (
      <div className="groups container">
        <Link to="/groups/new">
          <button>Start a new group</button>
        </Link>

        {groups.map((group, idx) => {
          return (
            <Link
              className="groupInfo-link"
              key={group.id}
              ref={(el) => (groupsRef.current[idx] = el)}
              to={`/groups/${group.id}`}
            >
              <div
                className={`groups group-container ${
                  isVisible[`http://localhost:3000/groups/${group.id}`]
                    ? "visible"
                    : ""
                }`}
              >
                <div className="group img-container">
                  <img
                    className="group img"
                    src={group.previewImage}
                    alt={group.previewImage}
                  />
                </div>
                <div className="group details-container">
                  <div>
                    <h3 className="group name">{group.name}</h3>
                    <h4 className="group location">
                      {group.city}, {group.state}
                    </h4>
                  </div>
                  <p className="group about">{group.about}</p>
                  <p className="group numMembers">
                    {group.numMembers}{" "}
                    {group.numMembers === 1 ? "member" : "members"}{" "}
                    <span className="group interpunct">·</span>{" "}
                    <span className="group type_privacy">
                      {group.type} {group.private ? "private" : "public"} group
                    </span>
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    )
  );
};

export default GroupsIndex;

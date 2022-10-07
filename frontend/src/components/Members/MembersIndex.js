import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { addMember, deleteMember } from "../../store/groups";
import "./Members.css";

const MembersIndex = ({ members, organizer }) => {
  const { groupId } = useParams();
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.session.user);

  const acceptRequest = (memberId) => async () => {
    const membership = {
      memberId,
      status: "member",
    };
    await dispatch(addMember(groupId, membership));
  };

  const rejectRequest = (memberId) => async () =>
    await dispatch(deleteMember(groupId, memberId));

  const resignMembership = (memberId) => async () =>
    await dispatch(deleteMember(groupId, memberId));

  const removeMember = (memberId) => async () =>
    await dispatch(deleteMember(groupId, memberId));

  return (
    members && (
      <div className="members container">
        {members.map((member) => {
          return (
            <div key={member.id} className={`members member-container`}>
              <div className="member profile-img">
                {/* insert profile image */}
              </div>
              <div className="member details-container">
                <div className="member details">
                  <p>
                    {member.firstName} {member.lastName}
                  </p>
                </div>

                <div className="member button-container">
                  {currentUser?.id === member?.id && (
                    <button
                      className="member button"
                      onClick={resignMembership(member.id)}
                    >
                      Resign From Group
                    </button>
                  )}
                  {organizer &&
                    (member.Membership.status !== "pending" ? (
                      currentUser.id !== member.id && (
                        <button
                          className="member button"
                          onClick={removeMember(member.id)}
                        >
                          Remove Member
                        </button>
                      )
                    ) : (
                      <>
                        <button
                          className="member button"
                          onClick={acceptRequest(member.id)}
                        >
                          Accept
                        </button>
                        <button
                          className="member button"
                          onClick={rejectRequest(member.id)}
                        >
                          Reject
                        </button>
                      </>
                    ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    )
  );
};

export default MembersIndex;

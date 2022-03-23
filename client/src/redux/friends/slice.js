export default function FriendsOverviewReducer(friends = [], action) {
    if (action.type === "friends-overview/list") {
        return action.payload.friends;
    } else if (action.type === "friends-overview/accept") {
        friends = friends.map((newFriend) => {
            if (newFriend.id === action.payload.id) {
                return { ...newFriend, accepted_status: true };
            }
            console.log("newFriend", newFriend);
            return newFriend;
        });
    }
    // else if (action.type === "friends-overview/cancel") {
    // }
    return friends;
}

export function getList(friends) {
    return {
        type: "friends-overview/list",
        payload: { friends },
    };
}

export function acceptFriend(id) {
    return {
        type: "friends-overview/accept",
        payload: { id },
    };
}

export function cancelRequest(id) {
    return {
        type: "friends-overview/cancel",
        payload: { id },
    };
}

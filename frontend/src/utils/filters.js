export function filterConversations(conversations, query) {
  const normalizedQuery = query.trim().toLowerCase()

  if (!normalizedQuery) {
    return conversations
  }

  return conversations.filter((conversation) =>
    [conversation.user.name, conversation.user.profile?.department, conversation.last_message?.message]
      .filter(Boolean)
      .some((value) => value.toLowerCase().includes(normalizedQuery)),
  )
}

export function filterPeople(users, currentUser, query) {
  const normalizedQuery = query.trim().toLowerCase()
  const currentUserId = Number(currentUser?.id)

  return users.filter((user) => {
    if (Number(user.id) === currentUserId) {
      return false
    }

    if (Boolean(user.is_admin)) {
      return false
    }

    if (!normalizedQuery) {
      return true
    }

    return [user.name, user.email, user.profile?.department, user.profile?.title]
      .filter(Boolean)
      .some((value) => value.toLowerCase().includes(normalizedQuery))
  })
}

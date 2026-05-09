import React, { useState } from 'react'
import { getInitials } from '../utils/formatters'
import { ProfileView } from './ProfileView'

export function PeopleView({
  peopleSearch,
  setPeopleSearch,
  filteredPeople,
  setSelectedUserId,
  setActiveView,
  startTransition
}) {
  const [viewingPerson, setViewingPerson] = useState(null)

  return (
    <section className="people-layout">
      <div className="panel people-toolbar">
        <div>
          <div className="section-kicker">Directory</div>
          <h3>Team Members</h3>
          <p className="section-subtext">Discover and connect with your colleagues</p>
        </div>
        <input
          className="search-input"
          type="search"
          value={peopleSearch}
          onChange={(event) => setPeopleSearch(event.target.value)}
          placeholder="Search teammates..."
        />
      </div>

      <section className="people-grid">
        {filteredPeople.map((user) => (
          <article key={user.id} className="panel person-card-minimal">
            <div className="avatar-circle large">{getInitials(user.name)}</div>
            <div className="person-brief">
              <h4 title={user.name}>{user.name}</h4>
              <span>{user.profile?.department ?? 'Team member'}</span>
            </div>

            <div className="person-actions-row">
              <button
                type="button"
                className="icon-action-btn"
                title="Send Message"
                onClick={() => {
                  startTransition(() => {
                    setSelectedUserId(user.id)
                    setActiveView('chat')
                  })
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
              </button>

              <button
                type="button"
                className="icon-action-btn"
                title="Quick Glance"
                onClick={() => setViewingPerson(user)}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
              </button>
            </div>
          </article>
        ))}
        {filteredPeople.length === 0 ? (
          <div className="panel person-card">
            <p className="empty-state">No teammates match that search.</p>
          </div>
        ) : null}
      </section>

      {viewingPerson && (
        <div className="profile-glance-portal">
          <ProfileView 
            currentUser={null} // Not used in read-only mode for targetUser
            targetUser={viewingPerson}
            onClose={() => setViewingPerson(null)}
          />
        </div>
      )}
    </section>
  )
}

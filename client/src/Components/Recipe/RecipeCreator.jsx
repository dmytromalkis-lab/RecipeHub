import React from 'react';
import './RecipeCreator.css';
import { useNavigate } from 'react-router-dom';
import useUserStore from '../../stores/userStore.js';
import UserAvatar from '../Main/Header/UserAvatar';

export default function RecipeCreator({ author: propAuthor = null }) {
  // propAuthor can be:
  // - null/undefined or the string 'You' -> means current user (creator is current user)
  // - a string (name) -> show name only
  // - an object -> { id, name, email, avatar }

  const currentUser = useUserStore((state) => state.user);

  // resolve the creator object
  let creator = null;
  if (propAuthor && typeof propAuthor === 'object') {
    creator = propAuthor;
  } else if (!propAuthor || propAuthor === 'You') {
    // when creating a recipe the author prop may be 'You' or empty — use current logged user
    creator = currentUser ?? null;
  } else if (typeof propAuthor === 'string') {
    creator = { name: propAuthor };
  }

  // try several name sources: explicit name, combined first/last, or fallback
  const name =
    creator?.name ||
    ((creator?.first_name || creator?.last_name)
      ? `${creator?.first_name ?? ''} ${creator?.last_name ?? ''}`.trim()
    : 'Author');
  const email = creator?.email ?? '';
  const avatar = creator?.avatar ?? undefined;

  // if creator has an id, link to that profile; otherwise fallback to generic /profile
  // support different id fields returned from the API / store
  const creatorId = creator?.id ?? creator?._id ?? creator?.user_id ?? creator?.userId;
  const profilePath = creatorId ? `/profile/${creatorId}` : '/profile';

  const navigate = useNavigate();

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      navigate(profilePath);
    }
  };

  return (
    <div className="recipe-creator">
      <div className="rc-avatar">
        {/* reuse UserAvatar for consistent avatar/fallback behavior; pass the creator's avatar and destination */}
        <UserAvatar src={avatar} alt={name} to={profilePath} />
      </div>

      <div
        className="rc-info"
        role="link"
        tabIndex={0}
        onClick={() => navigate(profilePath)}
        onKeyDown={handleKeyDown}
      >
        <div className="rc-name">{name}</div>
        {email ? <div className="rc-email">{email}</div> : null}
      </div>
    </div>
  );
}

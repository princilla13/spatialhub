import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const blockedHosts = ['dronedb.app', 'hub.dronedb.app', 'docs.dronedb.app'];

/** Prevents inherited demo links from taking users to the reference product. */
export default function LocalNavigationGuard() {
  const navigate = useNavigate();

  useEffect(() => {
    function keepNavigationLocal(event) {
      const anchor = event.target.closest('a[href]');
      if (!anchor) return;
      const destination = new URL(anchor.href, window.location.href);
      if (blockedHosts.some((host) => destination.hostname === host || destination.hostname.endsWith(`.${host}`))) {
        event.preventDefault();
        event.stopPropagation();
        // The detailed local landing page is the safe fallback until each linked
        // destination has its own SpatialHub implementation.
        navigate('/');
      }
    }

    document.addEventListener('click', keepNavigationLocal, true);
    return () => document.removeEventListener('click', keepNavigationLocal, true);
  }, [navigate]);

  return null;
}

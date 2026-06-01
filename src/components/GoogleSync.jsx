import React, { useState, useEffect } from "react";
import { useGoogleLogin, googleLogout } from "@react-oauth/google";
import { findBackupFile, downloadBackup, uploadBackup } from "../lib/driveSync";

export default function GoogleSync({ currentData, onDataRestored, t }) {
  const [accessToken, setAccessToken] = useState(() => localStorage.getItem("google_access_token") || null);
  const [syncStatus, setSyncStatus] = useState("idle"); // idle, syncing, success, error
  const [userInfo, setUserInfo] = useState(null);

  const login = useGoogleLogin({
    scope: "https://www.googleapis.com/auth/drive.appdata",
    onSuccess: (tokenResponse) => {
      setAccessToken(tokenResponse.access_token);
      localStorage.setItem("google_access_token", tokenResponse.access_token);
      fetchUserInfo(tokenResponse.access_token);
    },
    onError: (error) => {
      console.error("Login Failed:", error);
      setSyncStatus("error");
    },
  });

  const fetchUserInfo = async (token) => {
    try {
      const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUserInfo(data);
      } else if (res.status === 401) {
        // Token expired
        handleLogout();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogout = () => {
    googleLogout();
    setAccessToken(null);
    setUserInfo(null);
    setSyncStatus("idle");
    localStorage.removeItem("google_access_token");
  };

  // Fetch user info if token exists on mount
  useEffect(() => {
    if (accessToken) {
      fetchUserInfo(accessToken);
    }
  }, []);

  // Initial Sync (Download) when logged in
  useEffect(() => {
    if (!accessToken) return;
    let isMounted = true;

    const initialSync = async () => {
      setSyncStatus("syncing");
      try {
        const file = await findBackupFile(accessToken);
        if (file && isMounted) {
          const cloudData = await downloadBackup(accessToken, file.id);
          // Auto resolve conflict: higher XP wins
          const cloudXp = Number(cloudData.chinese_xp) || 0;
          const localXp = Number(currentData.chinese_xp) || 0;
          
          if (cloudXp > localXp) {
            onDataRestored(cloudData);
            setSyncStatus("success");
          } else if (localXp > cloudXp) {
            // Local is newer/higher, upload it immediately
            await uploadBackup(accessToken, currentData, file.id);
            setSyncStatus("success");
          } else {
            setSyncStatus("success");
          }
        } else if (!file && isMounted) {
          // No backup found, create one
          await uploadBackup(accessToken, currentData);
          setSyncStatus("success");
        }
      } catch (err) {
        console.error("Sync error:", err);
        if (err.message.includes("401")) handleLogout(); // token expired
        else if (isMounted) setSyncStatus("error");
      }
    };

    initialSync();
    return () => { isMounted = false; };
  }, [accessToken]); // run once on login

  // Debounced Auto Sync (Upload) when currentData changes
  useEffect(() => {
    if (!accessToken || syncStatus === "syncing") return;

    const timer = setTimeout(async () => {
      setSyncStatus("syncing");
      try {
        const file = await findBackupFile(accessToken);
        await uploadBackup(accessToken, currentData, file ? file.id : null);
        setSyncStatus("success");
      } catch (err) {
        console.error("Auto-sync error:", err);
        if (err.message.includes("401")) handleLogout();
        else setSyncStatus("error");
      }
    }, 5000); // 5s debounce

    return () => clearTimeout(timer);
  }, [currentData, accessToken]);

  return (
    <div className="google-sync-container" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      {!accessToken ? (
        <button 
          className="sync-btn" 
          onClick={() => login()} 
          title={t ? t("btnLoginGoogle") : "Đăng nhập để đồng bộ"}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px', background: 'transparent',
            border: '1px solid rgba(255,255,255,0.2)', color: '#fff', padding: '6px 12px',
            borderRadius: '20px', cursor: 'pointer', fontSize: '0.85rem'
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032 s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2 C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.761H12.545z"/></svg>
          Sync
        </button>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.1)', padding: '4px 10px', borderRadius: '20px' }}>
          {userInfo && <img src={userInfo.picture} alt="avatar" style={{ width: 22, height: 22, borderRadius: '50%' }} />}
          <span style={{ fontSize: '0.8rem', color: syncStatus === 'error' ? '#ff6b6b' : syncStatus === 'syncing' ? '#ffd93d' : '#4dabf7' }}>
            {syncStatus === 'syncing' ? 'Syncing...' : syncStatus === 'error' ? 'Sync Error' : 'Synced'}
          </span>
          <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '0.8rem', opacity: 0.7 }}>Thoát</button>
        </div>
      )}
    </div>
  );
}

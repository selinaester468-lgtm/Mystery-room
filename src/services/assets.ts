/**
 * Game Assets Management
 * Ensures all image assets are properly imported, bundled by Vite,
 * and preserved when exported/cloned to GitHub or deployed on GitHub Pages.
 */
import chibiHappyImg from '../assets/images/chibi_happy.jpg';
import chibiCryingImg from '../assets/images/chibi_crying.jpg';
import mysteryRoomBgImg from '../assets/images/mystery_room_bg.jpg';

export const GAME_IMAGES = {
  cozyBg: mysteryRoomBgImg,
  chibiHappy: chibiHappyImg,
  chibiCrying: chibiCryingImg,
  // Direct public fallback paths
  publicCozyBg: '/images/mystery_room_bg.jpg',
  publicChibiHappy: '/images/chibi_happy.jpg',
  publicChibiCrying: '/images/chibi_crying.jpg',
};

/**
 * Downloads/saves an image directly to the user's phone or computer gallery
 */
export async function downloadGameImage(imageUrl: string, filename: string = 'mystery-room-detective.jpg') {
  try {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);
    return true;
  } catch {
    // Fallback direct link download
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = filename;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return true;
  }
}

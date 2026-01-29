export default function Footer() {
  return (
    <footer className="border-t border-white/10 mt-20 py-6 text-center text-sm text-gray-400">
      <p>
        © {new Date().getFullYear()} EventX. All rights reserved.
      </p>
    </footer>
  );
}

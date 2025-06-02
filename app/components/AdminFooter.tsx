export default function AdminFooter(){
    return(
        <>
     {/* Admin Footer */}
     <footer>
              <div className="bg-[#231f20] md:py-4 py-3">
        <p className="text-center text-white md:text-base text-xs font-nato">
          &copy; {new Date().getFullYear()} Board of Boiler Engineers. All
          rights reserved.
        </p>
      </div>
     </footer>
        </>
    );
}
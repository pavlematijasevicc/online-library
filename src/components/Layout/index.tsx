import Navbar from '@/components/Navbar'
import SideMenu from '@/components/SideMenu'

export default function Layout({ children }) {
  return (
    <>
      <Navbar />
      <div className="grid grid-rows-[auto_1fr] grid-cols-[auto_1fr] min-h-screen mt-[72px]">
        <div className="col-start-1">
          <SideMenu />
        </div>
        <main className="row-start-2 col-start-2">{children}</main>
        <div
          className="absolute left-0 right-0 h-[1px] bg-grey-line -z-50"
          style={{ top: '142px' }}
        />
      </div>
    </>
  )
}

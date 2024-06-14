import Layout from '@/app/components/farmer/Layout'
import LeftSide from '@/app/components/farmer/chat/LeftSide'
import RightSide from '@/app/components/farmer/chat/RightSide'
import React from 'react'

const Page = () => {
    return (
        <div className=' w-full'>
            <Layout>

                <div className=' overflow-scroll flex relative h-[100vh] items-center gap-3 w-full justify-between'>
                    <div className=' w-[513px] h-full  bg-[#F0F0F0]  sticky top-0 left-0  '>
                        <LeftSide />
                    </div>
                    <div className=' h-full w-full '>
                        <RightSide />
                    </div>

                </div>


            </Layout>
        </div>
    )
}

export default Page
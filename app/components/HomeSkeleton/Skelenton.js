import { Card } from '@nextui-org/react'
import { Skeleton } from '@nextui-org/skeleton'
import React from 'react'

const Skelenton = () => {
    return (
        <div className=" flex  gap-5 my-[1em]">
            <div>

                <Card className=" md:w-[30vw] w-[200px]    space-y-5 p-4" radius="lg">
                    <Skeleton className=" w-5/5 rounded-lg">
                        <div className="h-24 rounded-lg bg-default-200 "></div>
                    </Skeleton>
                    <div className="space-y-3">
                        <Skeleton className="w-3/5 rounded-lg">
                            <div className="h-3 w-3/5 rounded-lg bg-default-200"></div>
                        </Skeleton>
                        <Skeleton className="w-4/5 rounded-lg">
                            <div className="h-3 w-4/5 rounded-lg bg-default-200"></div>
                        </Skeleton>
                        <Skeleton className="w-2/5 rounded-lg">
                            <div className="h-3 w-2/5 rounded-lg bg-default-300"></div>
                        </Skeleton>
                    </div>
                </Card>

            </div>
            <div>

                <Card className="md:w-[30vw] w-[200px]    space-y-5 p-4" radius="lg">
                    <Skeleton className=" w-5/5 rounded-lg">
                        <div className="h-24 rounded-lg bg-default-200 "></div>
                    </Skeleton>
                    <div className="space-y-3">
                        <Skeleton className="w-3/5 rounded-lg">
                            <div className="h-3 w-3/5 rounded-lg bg-default-200"></div>
                        </Skeleton>
                        <Skeleton className="w-4/5 rounded-lg">
                            <div className="h-3 w-4/5 rounded-lg bg-default-200"></div>
                        </Skeleton>
                        <Skeleton className="w-2/5 rounded-lg">
                            <div className="h-3 w-2/5 rounded-lg bg-default-300"></div>
                        </Skeleton>
                    </div>
                </Card>

            </div>
            <div>

                <Card className="md:w-[30vw] w-[200px]   space-y-5 p-4" radius="lg">
                    <Skeleton className=" w-5/5 rounded-lg">
                        <div className="h-24 rounded-lg bg-default-200 "></div>
                    </Skeleton>
                    <div className="space-y-3">
                        <Skeleton className="w-3/5 rounded-lg">
                            <div className="h-3 w-3/5 rounded-lg bg-default-200"></div>
                        </Skeleton>
                        <Skeleton className="w-4/5 rounded-lg">
                            <div className="h-3 w-4/5 rounded-lg bg-default-200"></div>
                        </Skeleton>
                        <Skeleton className="w-2/5 rounded-lg">
                            <div className="h-3 w-2/5 rounded-lg bg-default-300"></div>
                        </Skeleton>
                    </div>
                </Card>

            </div>

        </div>
    )
}

export default Skelenton
"use client"

import { useState } from "react"

import { CharacterFloatCard } from "~/components/common/CharacterFloatCard"
import { SearchInput } from "~/components/common/SearchInput"
import { Image } from "~/components/ui/Image"
import { UniLink } from "~/components/ui/UniLink"
import { getSiteLink } from "~/lib/helpers"
import { useTranslation } from "~/lib/i18n/client"
import { useGetShowcase } from "~/queries/home"

import topics from "../../../data/topics.json"
import { FollowAllButton } from "../common/FollowAllButton"

export function HomeSidebar({ hideSearch }: { hideSearch?: boolean }) {
  const showcaseSites = useGetShowcase()
  const { t } = useTranslation("index")

  const [showcaseMore, setShowcaseMore] = useState(false)

  return (
    <div className="w-80 pl-10 hidden sm:block space-y-10">
      {!hideSearch && <SearchInput />}
      <div className="text-center">
        <div className="text-zinc-700 space-y-3">
          <p className="font-bold text-lg">{t("Hot Topics")}</p>
          <ul className="overflow-y-clip relative text-left space-y-2">
            {topics.map((topic: any) => (
              <li className="flex align-middle" key={topic.name}>
                <UniLink
                  href={`/topic/${topic.name}`}
                  className="flex flex-col sm:hover:bg-hover px-4 py-2 -mx-4 rounded-lg transition-colors"
                >
                  <span className="font-medium">{topic.name}</span>
                  <span className="text-zinc-400 text-sm">
                    {topic.description}
                  </span>
                </UniLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="text-center">
        <div className="text-zinc-700 space-y-3">
          <p className="font-bold text-lg">{t("Suggested creators for you")}</p>
          <FollowAllButton
            characterIds={showcaseSites.data
              ?.map((s: { characterId?: string }) => s.characterId)
              .filter(Boolean)
              .map(Number)}
            siteIds={showcaseSites.data?.map(
              (s: { handle: string }) => s.handle,
            )}
          />
          {showcaseSites.isLoading && <p>{t("Loading")}...</p>}
          <ul
            className={`overflow-y-clip relative text-left space-y-4 ${
              showcaseMore ? "" : "max-h-[540px]"
            }`}
          >
            <div
              className={`absolute bottom-0 h-14 left-0 right-0 bg-gradient-to-t from-white via-white flex items-end justify-center font-bold cursor-pointer z-[1] text-sm ${
                showcaseMore ? "hidden" : ""
              }`}
              onClick={() => setShowcaseMore(true)}
            >
              {t("Show more")}
            </div>
            {showcaseSites.data?.map((site) => (
              <li className="flex align-middle" key={site.handle}>
                <UniLink
                  href={getSiteLink({
                    subdomain: site.handle,
                  })}
                  className="inline-flex align-middle w-full"
                >
                  <CharacterFloatCard siteId={site.handle}>
                    <span className="w-10 h-10 inline-block">
                      <Image
                        className="rounded-full"
                        src={
                          site?.metadata?.content?.avatars?.[0] ||
                          "ipfs://bafkreiabgixxp63pg64moxnsydz7hewmpdkxxi3kdsa4oqv4pb6qvwnmxa"
                        }
                        alt={site.handle}
                        width="40"
                        height="40"
                      ></Image>
                    </span>
                  </CharacterFloatCard>
                  <span className="ml-3 min-w-0 flex-1 justify-center inline-flex flex-col">
                    <span className="truncate w-full inline-block font-medium">
                      {site?.metadata?.content?.name}
                    </span>
                    {site?.metadata?.content?.bio && (
                      <span className="text-gray-500 text-xs truncate w-full inline-block mt-1">
                        {site.metadata.content?.bio}
                      </span>
                    )}
                  </span>
                </UniLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

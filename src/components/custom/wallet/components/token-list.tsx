'use client';

import { Balance, convertToRawAmount } from '@chromia/ft4';
import { useTokenBalance } from '@/hooks/contracts/queries/use-token-balance';
import Image from 'next/image';
import React from 'react';
import { cn } from '@/utils/tailwind';

// Extend the Balance type with additional properties

interface TokenListProps {
  compact?: boolean;
  fullList?: boolean;
  onViewAll?: () => void;
  className?: string;
}

export function TokenList({
  compact = false,
  fullList = false,
  onViewAll,
  className,
}: TokenListProps) {
  const { balances, isLoading: isLoadingBalances } = useTokenBalance();
  const showCompact = compact && !fullList;
  const displayBalances = showCompact ? balances.slice(0, 3) : balances;
  const hasMore = showCompact && balances.length > 1;

  return (
    <div className={cn('w-full flex flex-col h-full', className)}>
      <div className="flex items-center justify-between mb-2">
        {!fullList && (
          <h3 className="text-md font-semibold">
            Your Assets{balances.length ? ` (${balances.length})` : ''}
          </h3>
        )}
        {showCompact && hasMore && (
          <button
            className="text-sm text-primary font-medium hover:underline focus:outline-none"
            onClick={onViewAll}
          >
            View all
          </button>
        )}
      </div>
      <div className="relative flex-1 flex flex-col">
        {isLoadingBalances && (
          <div className="absolute right-0 top-0">
            <div className="h-3 w-3 rounded-full border-2 border-primary/60 border-t-transparent animate-spin"></div>
          </div>
        )}
        <div className="flex-1 overflow-y-auto">
          {displayBalances.length > 0 ? (
            <div className={cn('flex flex-col gap-4', fullList && 'pb-[120px]')}>
              {displayBalances.map((balance, index) => {
                const tokenBalance = balance as unknown as Balance;
                return (
                  <div
                    key={index}
                    className="relative rounded-xl bg-[#232323] p-4 flex items-center justify-between shadow-md transition hover:shadow-lg hover:bg-[#282828]"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden">
                        <Image
                          src={tokenBalance.asset.iconUrl}
                          alt={tokenBalance.asset.symbol}
                          width={40}
                          height={40}
                          className="object-contain"
                        />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-base font-semibold text-white">
                          {tokenBalance.asset.symbol}
                        </span>
                        <span className="text-sm text-submerged font-medium">
                          {convertToRawAmount(
                            tokenBalance.amount.toString(),
                            tokenBalance.asset.decimals
                          ).value.toString()}{' '}
                        </span>
                        <span className="text-sm text-submerged font-medium">
                          {tokenBalance.asset.symbol}
                        </span>
                      </div>
                    </div>
                    <span className="text-lg font-bold text-white">
                      {/* You can format the value as currency if needed */}
                      $3,127.12
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-secondary/30 via-secondary/50 to-secondary/30 p-4 shadow-sm backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent"></div>
              <div className="relative text-center">
                <p className="text-sm text-muted-foreground">Nothing found</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

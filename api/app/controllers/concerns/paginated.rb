module Paginated
  extend ActiveSupport::Concern

  DEFAULT_PER_PAGE = 20
  # Capped so a single request can't pull a whole table.
  MAX_PER_PAGE = 100

  private

  # Returns the requested page of scope and the pagination details to render with it.
  def paginate(scope)
    total_count = scope.count
    records = scope.limit(per_page).offset((page - 1) * per_page)
    pagination = { page: page, per_page: per_page, total_count: total_count, total_pages: (total_count.to_f / per_page).ceil }

    [ records, pagination ]
  end

  def page
    [ pagination_params[:page].to_i, 1 ].max
  end

  def per_page
    requested = pagination_params[:per_page].to_i
    requested.positive? ? [ requested, MAX_PER_PAGE ].min : DEFAULT_PER_PAGE
  end

  def pagination_params
    params.slice(:page, :per_page).permit(:page, :per_page)
  end
end
